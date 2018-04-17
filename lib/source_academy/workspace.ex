defmodule SourceAcademy.Workspace do
  @moduledoc false

  import Ecto.Changeset
  import Ecto.Query

  alias SourceAcademy.Repo

  alias SourceAcademy.Workspace.Code
  alias SourceAcademy.Workspace.Comment
  alias SourceAcademy.Workspace.Library

  def all_libraries, do: Repo.all(Library)

  def build_code(params) do
    %Code{}
    |> Code.changeset(params)
  end

  def build_comment(params) do
    %Comment{}
    |> Comment.changeset(params)
  end

  def build_library(params) do
    %Library{}
    |> Library.changeset(params)
  end

  def get_code(id) do
    Repo.get(Code, id)
  end

  def get_history_by_code(code) do
    code = Repo.preload(code, :history)
    code.history
  end

  def last_comment_of(code) do
    Repo.one(
      from c in Comment,
      where: c.code_id == ^code.id,
      order_by: [desc: c.inserted_at],
      preload: [:poster]
    )
  end

  def comments_of(code) do
    Repo.all(
      from c in Comment,
      where: c.code_id == ^code.id,
      order_by: [asc: :inserted_at],
      preload: [:poster]
    )
  end

  def create_code(params, owner) do
    changeset = params
      |> build_code()
      |> put_assoc(:owner, owner)
    Repo.insert(changeset)
  end

  def create_history_code(params, owner, history) do
    changeset = params
      |> build_code()
      |> put_assoc(:owner, owner)
      |> put_assoc(:history, history)
    Repo.insert(changeset)
  end

  def create_comment(params, poster, code_id) do
    code = get_code(code_id)
    changeset = params
      |> build_comment()
      |> put_assoc(:poster, poster)
      |> put_assoc(:code, code)
    comment = Repo.insert!(changeset)
    Repo.preload(comment, :poster)
  end

  def create_library(params) do
    changeset = params
      |> build_library()
    Repo.insert(changeset)
  end

  def delete_library(id) do
    library = Repo.get(Library, id)
    Repo.delete!(library)
  end

  def change_library(id) do
    library = Repo.get(Library, id)
    raw_json = Poison.encode!(library.json)
    library
    |> change(%{raw_json: raw_json})
    |> Library.changeset(%{})
  end

  def update_library(id, params) do
    library = Repo.get(Library, id)
    changeset = Library.changeset(library, params)
    Repo.update(changeset)
  end

  def update_code(id, params, user) do
    code = Repo.get(Code, id)
    cond do
      code == nil ->
        {:error, :not_found}
      code.owner_id !== user.id ->
        {:error, :unauthorized}
      code.is_readonly ->
        {:error, :forbidden}
      true ->
        changeset = Code.changeset(code, params)
        Repo.update(changeset)
      end
  end

  def update_history_with_code(save_history, new_code) do
    new_codes = save_history.codes ++ [new_code]
                    |> Enum.map(&Ecto.Changeset.change/1)
    save_history
    |> Ecto.Changeset.change
    |> Ecto.Changeset.put_assoc(:codes, new_codes)
    |> Repo.update
  end

  def update_history(code_id, params, user) do
    code = Repo.get(Code, code_id)
    save_history = get_history_by_code(code)
    cond do
      code == nil ->
        {:error, :not_found}
      code.owner_id !== user.id ->
        {:error, :unauthorized}
      code.is_readonly ->
        {:error, :forbidden}
      true ->
        if params[:content] != code.content do
          new_code = create_history_code(%{
            title: "history",
            content: code.content,
            generated_at: code.updated_at
          }, user, save_history)
          save_history = Repo.preload(save_history, :codes)
          {:ok, save_history}
        else
          save_history = Repo.preload(save_history, :codes)
          #codes = save_history.codes
          #codes
          #|> Enum.filter(&(&1.title == "history"))
          #|> Enum.filter(&(&1.content == params[:content]))
          #|> Enum.map(&(Code.changeset(&1, %{generated_at: Timex.now()})))
          #|> Enum.map(&(Repo.update(&1)))
          {:ok, save_history}
        end
      end
  end

end

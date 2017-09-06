defmodule SourceAcademy.Workspace.Comment do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Workspace.Code

  schema "comments" do
    field :content, :string, default: ""
    field :is_resolved, :boolean, default: false

    belongs_to :poster, User
    belongs_to :code, Code

    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(content is_resolved)a

  def changeset(comment, params \\ :empty) do
    comment
    |> cast(params, @required_fields ++ @optional_fields)
  end
end

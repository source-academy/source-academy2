defmodule SourceAcademy.Workspace.Library do
  @moduledoc false
  use SourceAcademy, :model

  import Ecto.Changeset

  @default_json %{
    week: 3,
    externals: [],
    globals: [],
    files: []
  }

  schema "libraries" do
    field :title, :string
    field :json, :map, default: @default_json
    field :raw_json, :string, virtual: true
  end

  @required_fields ~w(title)a
  @optional_fields ~w(raw_json)a

  def changeset(library, params \\ %{}) do
    library
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> put_json()
  end

  defp put_json(changeset) do
    change = get_change(changeset, :raw_json)
    if change do
      json = Poison.decode!(change)
      if json != nil do
        put_change(changeset, :json, json)
      else
        changeset
      end
    else
      changeset
    end
  end
end

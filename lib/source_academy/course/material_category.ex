defmodule SourceAcademy.Course.MaterialCategory do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Material

  schema "materials_category" do
    field :name, :string
    field :is_shown, :boolean, default: true

    has_many :materials, Material, on_delete: :delete_all

    timestamps()
  end

  @required_fields ~w(name)a
  @optional_fields ~w()a

  def changeset(category, params \\ []) do
    category
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end

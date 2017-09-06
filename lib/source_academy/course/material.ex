defmodule SourceAcademy.Course.Material do
  @moduledoc false
  use SourceAcademy, :model

  use Arc.Ecto.Schema

  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Course.Attachment
  alias SourceAcademy.Course.MaterialCategory

  schema "materials" do
    field :title, :string
    field :description, :string
    field :is_public, :boolean, default: true
    field :url, Attachment.Type

    belongs_to :category, MaterialCategory
    belongs_to :uploader, User

    timestamps()
  end

  @required_fields ~w(title)a
  @optional_fields ~w(description)a

  @required_file_fields ~w(url)a

  def changeset(material, params \\ []) do
    material
    |> cast(params, @required_fields ++ @optional_fields)
    |> cast_attachments(params, @required_file_fields)
    |> validate_required(@required_fields ++ @required_file_fields)
  end
end

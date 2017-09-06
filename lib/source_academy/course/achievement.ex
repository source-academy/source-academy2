defmodule SourceAcademy.Course.Achievement do
  @moduledoc false
  use SourceAcademy, :model
  use Arc.Ecto.Schema

  alias SourceAcademy.Course.Attachment

  schema "achievements" do
    field :title, :string
    field :description, :string
    field :display_order, :integer
    field :image_url, Attachment.Type
    field :category, :string
    field :query, :string

    timestamps()
  end

  @required_fields ~w(title)a
  @optional_fields ~w(description query category)a
  @optional_file_fields ~w(image_url)a

  def changeset(achievement, params) do
    achievement
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> cast_attachments(params, @optional_file_fields)
  end
end

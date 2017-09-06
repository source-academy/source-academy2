defmodule SourceAcademy.Course.Announcement do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User

  schema "announcements" do
    field :title, :string
    field :content, :string, default: "No Content"
    field :is_pinned, :boolean, default: false
    field :is_published, :boolean, default: false

    belongs_to :poster, User

    timestamps()
  end

  @required_fields ~w(title)a
  @optional_fields ~w(content is_pinned is_published)a

  def changeset(announcement, params \\ :empty) do
    announcement
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end

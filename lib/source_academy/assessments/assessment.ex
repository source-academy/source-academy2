defmodule SourceAcademy.Assessments.Assessment do
  @moduledoc false
  use SourceAcademy, :model
  use Arc.Ecto.Schema

  alias SourceAcademy.Assessments.Type
  alias SourceAcademy.Assessments.Attachment
  alias SourceAcademy.Assessments.Question

  @default_library %{
    week: 3,
    globals: [],
    externals: [],
    files: []
  }

  schema "assessments" do
    field :name, :string
    field :title, :string
    field :library, :map, default: @default_library
    field :type, Type
    field :is_published, :boolean, default: false
    field :open_at, Timex.Ecto.DateTime
    field :close_at, Timex.Ecto.DateTime
    field :description, :string, default: ""
    field :briefing, :string, default: ""
    field :max_xp, :integer, default: 0

    field :cover_url, Attachment.Type
    field :story_url, Attachment.Type

    has_many :questions, Question, on_delete: :delete_all
    field :raw_library, :string, virtual: true
    timestamps()
  end

  @required_fields ~w(name title type open_at close_at max_xp library)a
  @optional_fields ~w(description briefing is_published raw_library)a

  @optional_file_fields ~w(cover_url story_url)a

  def changeset(assessment, params) do
    params = params
      |> convert_date("open_at")
      |> convert_date("close_at")
    assessment
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_open_close_date
    |> validate_number(:max_xp, greater_than_or_equal_to: 0)
    |> cast_attachments(params, @optional_file_fields)
    |> put_library
  end

  defp validate_open_close_date(changeset) do
    validate_change changeset, :open_at, fn :open_at, open_at ->
      if open_at >= get_field(changeset, :close_at) do
        [open_at: "Open date must be < close date"]
      else
        []
      end
    end
  end

  defp put_library(changeset) do
    change = get_change(changeset, :raw_library)
    if change do
      json = Poison.decode!(change)
      if json != nil do
        put_change(changeset, :library, json)
      else
        changeset
      end
    else
      changeset
    end
  end
end

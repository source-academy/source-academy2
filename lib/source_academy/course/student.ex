defmodule SourceAcademy.Course.Student do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User

  schema "students" do
    field :is_phantom, :boolean, default: false
    field :experience_point, :integer, default: 0
    field :level, :integer, default: 0
    field :latest_story, :string
    belongs_to :user, User
    timestamps()
  end

  @optional_fields ~w(is_phantom experience_point level latest_story)s

  def changeset(student, params) do
    student
    |> cast(params, @optional_fields)
    |> validate_number(:level, greater_than_or_equal_to: 0)
    |> validate_number(:experience_point, greater_than_or_equal_to: 0)
  end
end

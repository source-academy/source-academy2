defmodule SourceAcademy.Course.StudentAchievement do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Student
  alias SourceAcademy.Course.Achievement

  schema "student_achievements" do
    belongs_to :student, Student
    belongs_to :achievement, Achievement

    timestamps()
  end

  def changeset(student_achievement, params) do
    cast(student_achievement, params, [])
  end
end

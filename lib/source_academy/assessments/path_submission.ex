defmodule SourceAcademy.Assessments.PathSubmission do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Student
  alias SourceAcademy.Assessments.Question
  alias SourceAcademy.Assessments.MCQChoice

  schema "path_submissions" do
    field :code, :string
    field :is_correct, :boolean
    belongs_to :student, Student
    belongs_to :question, Question
    belongs_to :mcq_choice, MCQChoice
    timestamps()
  end

  @required_fields ~w(is_correct)a
  @optional_fields ~w(code)a

  def changeset(submission, params) do
    submission
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end

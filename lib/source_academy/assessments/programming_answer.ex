defmodule SourceAcademy.Assessments.ProgrammingAnswer do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.ProgrammingQuestion
  alias SourceAcademy.Assessments.Submission
  alias SourceAcademy.Workspace.Code

  schema "assessment_programming_answers" do
    field :marks, :integer, default: 0

    belongs_to :submission, Submission
    belongs_to :question, ProgrammingQuestion
    belongs_to :code, Code
  end

  @required_fields ~w(marks)a
  @optional_fields ~w()a

  def changeset(answer, params) do
    answer
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_number(:marks, greater_than_or_equal_to: 0)
  end
end

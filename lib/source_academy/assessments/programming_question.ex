defmodule SourceAcademy.Assessments.ProgrammingQuestion do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.Question
  alias SourceAcademy.Assessments.TestCase

  @default_content """
Type the description of the question here, using markdown.
  """

  @default_solution_template """
// Solution Template (Visible to student)
// Type the student's solution template for this question
// WARNING WARNING WARNING
// Do not put sample solution/part of the solution here!!!
// WARNING WARNING WARNING
  """

  @default_solution_header """
// Solution Header (Hidden to Student)
// Put the student's solution template for this question
  """

  @default_solution """
// Sample Solution (Hidden to Student)
// Put the sample solution here to help Avenger
// with the grading
  """

  schema "assessment_programming_questions" do
    field :content, :string, default: @default_content
    field :solution_template, :string, default: @default_solution_template
    field :solution_header, :string, default: @default_solution_header
    field :solution, :string, default: @default_solution

    belongs_to :question, Question
    has_many :test_cases, TestCase

    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(content solution_template solution_header solution)a

  def changeset(question, params) do
    question
    |> cast(params, @required_fields ++ @optional_fields)
    |> unique_constraint(:question,
         name: :assessment_programming_questions_question_id_index)
  end
end

defmodule SourceAcademyAdmin.AssessmentView do
  use SourceAcademyAdmin, :view

  def display_question_type(question) do
    if question.programming_question != nil do
      "Programming"
    else
      "Multiple Choice"
    end
  end

  def display_question_header(assessment, question) do
    name = display_assessment_name(assessment)
    order = Integer.to_string(question.display_order)
    name <> " Q" <> order
  end

  def display_grading_header(assessment, student) do
    "Grading for "
      <> display_assessment_name(assessment)
      <> " (" <> display_name(student.user) <> ")"
  end
end

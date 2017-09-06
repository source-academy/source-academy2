defmodule SourceAcademy.Assessments.MCQQuestion do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.Question
  alias SourceAcademy.Assessments.MCQChoice

  @default_content """
Type the description of the question here,
using markdown.
  """

  schema "assessment_mcq_questions" do
    field :content, :string, default: @default_content
    belongs_to :question, Question
    has_many :choices, MCQChoice
    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(content)a

  def changeset(question, params) do
    question
    |> cast(params, @required_fields ++ @optional_fields)
    |> unique_constraint(:question,
       name: :assessment_mcq_questions_question_id_index)
  end
end

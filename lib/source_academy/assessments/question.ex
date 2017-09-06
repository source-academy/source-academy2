defmodule SourceAcademy.Assessments.Question do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.Assessment
  alias SourceAcademy.Assessments.ProgrammingQuestion
  alias SourceAcademy.Assessments.MCQQuestion

  schema "assessment_questions" do
    field :title, :string
    field :display_order, :integer
    field :weight, :integer
    belongs_to :assessment, Assessment
    has_one :mcq_question, MCQQuestion, on_delete: :delete_all
    has_one :programming_question, ProgrammingQuestion, on_delete: :delete_all

    timestamps()
  end

  @required_fields ~w(title weight)a

  def changeset(question, params) do
    question
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
    |> validate_number(:weight, greater_than: 0)
  end
end

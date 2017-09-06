defmodule SourceAcademy.Assessments.TestCase do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Assessments.ProgrammingQuestion

  schema "assessment_test_cases" do
    field :is_private, :boolean, default: false
    field :code, :string
    field :expected_result, :string

    belongs_to :programming_question, ProgrammingQuestion

    timestamps()
  end

  @required_fields ~w(code expected_result)a
  @optional_fields ~w(is_private)a

  def changeset(test_case, params) do
    test_case
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end

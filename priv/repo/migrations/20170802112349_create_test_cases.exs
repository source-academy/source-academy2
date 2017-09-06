defmodule SourceAcademy.Repo.Migrations.CreateTestCases do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:assessment_test_cases) do
      add :is_private, :boolean, default: false
      add :code, :string
      add :expected_result, :string

      add :programming_question_id,
        references(:assessment_programming_questions)

      timestamps()
    end
  end
end

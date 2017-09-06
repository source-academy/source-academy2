defmodule SourceAcademy.Repo.Migrations.FixHasManyTestCases do
  use Ecto.Migration

  def change do
    execute "DROP INDEX IF EXISTS assessment_test_cases_programming_question_id_index"
  end
end

defmodule SourceAcademy.Repo.Migrations.DeleteProgrammingQuestionOnDeleteQuestion do
  @moduledoc false
  use Ecto.Migration

  def change do
    execute "ALTER TABLE assessment_programming_questions DROP CONSTRAINT assessment_programming_questions_question_id_fkey"
    alter table(:assessment_programming_questions) do
      modify :question_id, references(:assessment_questions, on_delete: :delete_all)
    end
  end
end

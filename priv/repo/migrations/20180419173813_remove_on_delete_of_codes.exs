defmodule SourceAcademy.Repo.Migrations.RemoveOnDeleteOfCodes do
  use Ecto.Migration

  def change do
    alter table(:assessment_save_history) do
      remove :submission_id
      remove :question_id
      add :submission_id, references(:submissions)
      add :question_id, references(:assessment_programming_questions)
    end
  end
end

defmodule SourceAcademy.Repo.Migrations.CreateHistories do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:assessment_save_history) do
      add :code, references(:codes, on_delete: :nilify_all)
      add :submission_id, references(:submissions, on_delete: :delete_all)
      add :question_id, references(:assessment_programming_questions,
        on_delete: :delete_all)
    end
  end
end

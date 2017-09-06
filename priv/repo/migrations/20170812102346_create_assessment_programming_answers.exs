defmodule SourceAcademy.Repo.Migrations.CreateAssessmentProgrammingAnswers do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:assessment_programming_answers) do
      add :marks, :integer

      add :code, references(:codes, on_delete: :nilify_all)
      add :submission, references(:submissions, on_delete: :delete_all)
      add :question, references(:assessment_programming_questions,
        on_delete: :delete_all)
    end
  end
end

defmodule SourceAcademy.Repo.Migrations.CreateAssessmentQuestions do
  use Ecto.Migration

  def change do
    create table(:assessment_questions) do
      add :title, :string
      add :display_order, :integer
      add :weight, :integer

      add :assessment_id, references(:assessments, on_delete: :delete_all)
    end
    create index(:assessment_questions, [:assessment_id, :display_order], unique: true)
  end
end

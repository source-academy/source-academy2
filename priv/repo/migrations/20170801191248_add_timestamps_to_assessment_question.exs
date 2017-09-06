defmodule SourceAcademy.Repo.Migrations.AddTimestampsToAssessmentQuestion do
  use Ecto.Migration

  def change do
    alter table(:assessment_questions) do
      timestamps()
    end
  end
end

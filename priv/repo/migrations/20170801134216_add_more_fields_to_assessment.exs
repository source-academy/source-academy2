defmodule SourceAcademy.Repo.Migrations.AddMoreFieldsToAssessment do
  use Ecto.Migration

  def change do
    alter table(:assessments) do
      add :is_published, :boolean
      add :open_at, :timestamp
      add :close_at, :timestamp
    end
  end
end

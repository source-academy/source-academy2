defmodule SourceAcademy.Repo.Migrations.AddPriorityAtAssessments do
  use Ecto.Migration

  def change do
    alter table(:assessments) do
      add :priority, :integer, default: 0
    end
  end
end

defmodule SourceAcademy.Repo.Migrations.AddHistoryIdToCode do
  use Ecto.Migration

  def change do
    alter table(:codes) do
      add :save_history_id, references(:assessment_save_history)
    end
  end
end

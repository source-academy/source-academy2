defmodule SourceAcademy.Repo.Migrations.ReaddHistoryIdToCodes do
  use Ecto.Migration

  def up do
    alter table(:codes) do
      remove :save_history_id
      add :save_history_id, references(:assessment_save_history, on_delete: :delete_all)
    end
  end

  def down do
    alter table(:codes) do
      remove :save_history_id
      add :save_history_id, references(:assessment_save_history)
    end
  end
end

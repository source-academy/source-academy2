defmodule SourceAcademy.Repo.Migrations.ReaddHistoryIdToCodes do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE codes DROP CONSTRAINT codes_save_history_id_fkey"
    alter table(:codes) do
      modify :save_history_id, references(:assessment_save_history, on_delete: :delete_all)
    end
  end

  def down do
    execute "ALTER TABLE codes DROP CONSTRAINT codes_save_history_id_fkey"
    alter table(:codes) do
      modify :save_history_id, references(:assessment_save_history)
    end
  end
end

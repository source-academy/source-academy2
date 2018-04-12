defmodule SourceAcademy.Repo.Migrations.AddTimestampsToCodes do
  use Ecto.Migration

  def up do
    alter table(:codes) do
      add :saved_at, :timestamp
    end
  end

  def down do
    alter table(:codes) do
      remove :saved_at
    end
  end
end

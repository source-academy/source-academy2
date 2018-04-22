defmodule SourceAcademy.Repo.Migrations.AddGeneratedAtToCodes do
  use Ecto.Migration

  def change do
    alter table(:codes) do
      add :generated_at, :timestamp
    end
  end
end

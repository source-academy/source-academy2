defmodule SourceAcademy.Repo.Migrations.AddIsPhantomToStudent do
  use Ecto.Migration

  def change do
    alter table(:students) do
      add :is_phantom, :boolean
    end
  end
end

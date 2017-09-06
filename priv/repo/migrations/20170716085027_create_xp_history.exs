defmodule SourceAcademy.Repo.Migrations.CreateXpHistory do
  use Ecto.Migration

  def change do
    create table(:xp_history) do
      add :reason, :string
      add :amount, :integer

      add :giver_id, references(:users)
      add :student_id, references(:students)

      timestamps()
    end
    create index(:xp_history, [:student_id])
  end
end

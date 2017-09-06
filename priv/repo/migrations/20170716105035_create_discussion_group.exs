defmodule SourceAcademy.Repo.Migrations.CreateDiscussionGroup do
  use Ecto.Migration

  def change do
    create table(:discussion_group) do
      add :staff_id, references(:users)
      add :student_id, references(:students)

      timestamps()
    end
    create index(:discussion_group, [:staff_id])
  end
end

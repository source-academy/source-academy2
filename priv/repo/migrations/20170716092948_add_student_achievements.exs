defmodule SourceAcademy.Repo.Migrations.AddStudentAchievements do
  use Ecto.Migration

  def change do
    create table(:student_achievements) do
      add :student_id, references(:students, on_delete: :delete_all)
      add :achievement_id, references(:achievements, on_delete: :delete_all)

      timestamps()
    end

    create index(:student_achievements,
      [:student_id, :achievement_id], unique: true)
  end
end

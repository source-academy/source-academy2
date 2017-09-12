defmodule SourceAcademy.Repo.Migrations.ChangePaMarksToFloat do
  use Ecto.Migration

  def up do
    alter table(:assessment_programming_answers) do
      modify :marks, :float
    end
  end

  def down do
    alter table(:assessment_programming_answers) do
      modify :marks, :integer
    end
  end
end

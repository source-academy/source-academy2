defmodule SourceAcademy.Repo.Migrations.AddMaxXpToAssessment do
  use Ecto.Migration

  import Ecto.Query

  alias SourceAcademy.Repo

  def change do
    alter table(:assessments) do
      add :max_xp, :integer, default: 0
    end

    flush()

    from(a in "assessments", update: [set: [max_xp: 0]])
    |> Repo.update_all([])
  end
end

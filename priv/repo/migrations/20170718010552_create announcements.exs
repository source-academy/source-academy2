defmodule :"Elixir.SourceAcademy.Repo.Migrations.Create announcements" do
  use Ecto.Migration

  def change do
    create table(:announcements) do
      add :title, :string
      add :content, :text
      add :is_pinned, :boolean
      add :is_published, :boolean

      add :poster_id, references(:users)

      timestamps()
    end
  end
end

defmodule SourceAcademy.Repo.Migrations.CreateMcqChoices do
  @moduledoc false

  use Ecto.Migration

  def change do
    create table(:assessment_mcq_choices) do
      add :content, :text
      add :hint, :text
      add :is_correct, :boolean
      add :mcq_question_id, references(:assessment_mcq_questions,
        on_delete: :delete_all)
      timestamps()
    end
  end
end

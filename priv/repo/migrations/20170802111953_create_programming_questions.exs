defmodule SourceAcademy.Repo.Migrations.CreateProgrammingQuestions do
  @moduledoc false
  use Ecto.Migration

  def change do
    create table(:assessment_programming_questions) do
      add :content, :text
      add :solution_template, :text
      add :solution_header, :text
      add :solution, :text

      add :question_id, references(:assessment_questions)

      timestamps()
    end

    create unique_index(
      :assessment_programming_questions,
      [:question_id],
      name: :assessment_programming_questions_question_id_index
    )
  end
end

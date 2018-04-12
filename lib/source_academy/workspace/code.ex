defmodule SourceAcademy.Workspace.Code do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Assessments.SaveHistory

  schema "codes" do
    field :title, :string, default: ""
    field :content, :string, default: "\n"
    field :is_public, :boolean, default: false
    field :is_readonly, :boolean, default: false
    field :generated_at, Timex.Ecto.DateTime

    belongs_to :owner, User
    belongs_to :history, SaveHistory, foreign_key: :save_history_id

    timestamps()
  end

  @required_fields ~w()a
  @optional_fields ~w(title content is_public is_readonly generated_at)a

  def changeset(code, params \\ :empty) do
    code
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
  end
end

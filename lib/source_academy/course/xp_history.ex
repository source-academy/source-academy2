defmodule SourceAcademy.Course.XPHistory do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Course.Student
  alias SourceAcademy.Accounts.User

  schema "xp_history" do
    field :reason, :string
    field :amount, :integer

    belongs_to :giver, User
    belongs_to :student, Student
    timestamps()
  end

  @required_fields ~w(reason amount)a

  def changeset(xp_history, params) do
    xp_history
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
    |> validate_length(:reason, min: 1)
  end
end

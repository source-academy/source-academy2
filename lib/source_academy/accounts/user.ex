defmodule SourceAcademy.Accounts.User do
  @moduledoc false
  use SourceAcademy, :model

  alias SourceAcademy.Accounts.Authorization

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :bio, :string
    field :email, :string
    field :role, :string

    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :passwd_reset_id, :string
    field :passwd_reset_id_expiry, :utc_datetime

    has_many :authorizations, Authorization, on_delete: :delete_all

    timestamps()
  end

  @required_fields ~w(first_name email)a
  @optional_fields ~w(last_name bio)a
  @required_registration_fields ~w(password password_confirmation)a
  @user_roles ~w(admin staff student)s
  @email_format ~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/

  def identity_registration_changeset(user, params \\ :empty) do
    user
    |> cast(params, @required_fields ++
          @required_registration_fields ++ @optional_fields)
    |> validate_required(@required_fields ++ @required_registration_fields)
    |> validate_email
    |> unique_constraint(:email)
    |> validate_length(:password, min: 8, max: 90)
    |> validate_confirmation(:password)
  end

  def changeset(user, params \\ :empty) do
    user
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_inclusion(:role, @user_roles)
    |> validate_email
    |> unique_constraint(:email)
  end

  defp validate_email(user) do
    validate_format(user, :email, @email_format)
  end
end

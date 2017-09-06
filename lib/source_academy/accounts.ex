defmodule SourceAcademy.Accounts do
  @moduledoc false

  import Ecto.Changeset
  import Ecto.Query

  alias Comeonin.Pbkdf2
  alias SourceAcademy.Repo
  alias SourceAcademy.Accounts.User
  alias SourceAcademy.Accounts.Authorization
  alias SourceAcademy.Course

  require Logger

  def all_users, do: Repo.all(User)
  def all_students, do: list_user_by_role("student")
  def all_staffs, do: list_user_by_role("staff")

  def staff?(user), do: user.role == "staff" || user.role == "admin"

  def get_user(id), do: Repo.get(User, id)

  def build_registration(params) do
    User.identity_registration_changeset(%User{}, params)
  end

  def build_login(params) do
    %Authorization{}
    |> Authorization.changeset(params)
    |> validate_required([:uid, :password])
  end

  def register_with_identity(params) do
    role = role_from_registration_code(params["registration_code"])
    if role != nil do
      Repo.transaction fn ->
        case create_user_from_registration(params, role) do
          {:ok, user} -> case create_student_for_new_user(user) do
            {:ok, _} -> user
            {:error, changeset} -> Repo.rollback(changeset)
          end
          {:error, changeset} ->
            Repo.rollback(changeset)
        end
      end
    else
      {:error, :invalid_registration_code}
    end
  end

  def sign_in_with_identity(uid, password) do
    case find_authorization(uid, "identity") do
      {:ok, auth} ->
        case check_password(password, auth.token) do
          :ok -> {:ok, Repo.get(User, auth.user_id)}
          {:error, _} -> {:error, :incorrect_email_or_password}
        end
      _ -> {:error, :incorrect_email_or_password}
    end
  end

  defp find_authorization(uid, provider) do
    case Repo.get_by(Authorization, uid: uid, provider: provider) do
      nil -> {:error, :not_found}
      authorization -> {:ok, authorization}
    end
  end

  defp check_password(password, hash) do
    case password do
      password when is_binary(password) ->
        if Pbkdf2.checkpw(password, hash) do
          :ok
        else
          Logger.info("here")
          {:error, :password_does_not_match}
        end
      _ -> {:error, :empty_password}
    end
  end

  defp create_user_from_registration(params, role) do
    user_changeset = %User{}
      |> User.identity_registration_changeset(params)
      |> change(%{role: role})
    auth_params = %{
      "password" => params["password"],
      "password_confirmation" => params["password_confirmation"]
    }
    case Repo.insert(user_changeset) do
      {:ok, user} -> create_authorization(auth_params, user)
      {:error, changeset} -> Repo.rollback(changeset)
    end
  end

  defp create_authorization(params, user) do
    changeset =
      %Authorization{}
      |> Authorization.identity_registration_changeset(params)
      |> put_assoc(:user, user)
      |> change(%{ provider: "identity", uid: user.email })
      |> put_password_in_token(params["password"])
    case Repo.insert(changeset) do
      {:ok, _} -> {:ok, user}
      {:error, changeset} -> Repo.rollback(changeset)
    end
  end

  defp create_student_for_new_user(user) do
    case user.role do
      "student" -> Course.create_student(user)
      _ -> Course.create_phantom_student(user)
    end
  end

  defp put_password_in_token(changeset, password) do
    if changeset.valid? do
      token = Pbkdf2.hashpwsalt(password)
      change(changeset, %{token: token})
    else
      changeset
    end
  end

  defp role_from_registration_code(code) do
    cond do
      code == student_registration_code() -> "student"
      code == staff_registration_code() -> "staff"
      code == admin_registration_code() -> "admin"
      true -> nil
    end
  end

  defp admin_registration_code do
    Application.get_env(:source_academy, :admin_registration_code)
  end

  defp student_registration_code do
    Application.get_env(:source_academy, :student_registration_code)
  end

  defp staff_registration_code do
    Application.get_env(:source_academy, :staff_registration_code)
  end

  defp list_user_by_role(role) do
    Repo.all(
      from u in User,
      where: u.role == ^role
    )
  end
end

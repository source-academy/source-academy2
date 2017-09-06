defmodule SourceAcademyWeb.AuthController do
  @moduledoc false
  use SourceAcademyWeb, :controller

  alias SourceAcademyWeb.AuthView
  alias SourceAcademyWeb.LayoutView

  alias SourceAcademy.Accounts

  alias Guardian.Plug, as: GPlug
  alias Guardian.Permissions

  plug Ueberauth
  require Logger

  def login(conn, _params) do
    redirect_if_logged_in conn, fn conn ->
      changeset = conn.assigns[:changeset] || Accounts.build_login(%{})
      action = auth_path(conn, :callback, "identity", type: "login")
      render(conn, "login.html", changeset: changeset, action: action)
    end
  end

  def signup(conn, _params) do
    redirect_if_logged_in conn, fn conn ->
      changeset = Accounts.build_registration(%{})
      action = auth_path(conn, :callback, "identity", type: "register")
      render(conn, "signup.html", changeset: changeset, action: action)
    end
  end

  def callback(conn, %{"type" => "register", "user" => params}) do
    case Accounts.register_with_identity(params) do
      {:ok, user} ->
        conn
        |> guardian_sign_in(user)
        |> put_flash(:info, "Signed in as #{user.first_name}")
        |> redirect(to: page_path(conn, :index))
      {:error, :invalid_registration_code} ->
        conn
        |> put_flash(:error, "Invalid Registration Code")
        |> redirect(to: auth_path(conn, :signup))
      {:error, changeset} ->
        action = auth_path(conn, :callback, "identity", type: "register")
        conn
        |> put_flash(:error, "There is one or more problem in your registration data")
        |> render("signup.html", changeset: changeset, action: action)
    end
  end

  def callback(conn, %{"type" => "login", "authorization" => params}) do
    case Accounts.sign_in_with_identity(params["uid"], params["password"]) do
      {:ok, user} ->
        conn = conn
          |> guardian_sign_in(user)
          |> put_flash(:info, "Signed in as #{user.first_name}")
        if user.role == "staff" do
          redirect conn, to: admin_page_path(conn, :index)
        else
          redirect conn, to: page_path(conn, :index)
        end
      {:error, _} ->
        conn
        |> put_flash(:error, "Incorrect e-mail or password")
        |> redirect(to: auth_path(conn, :login))
    end
  end

  def callback(%{assigns: %{ueberauth_failure: fails}} = conn, %{"type" => "login"}) do
    conn
    |> put_flash(:error, hd(fails.errors).message)
    |> redirect(to: auth_path(conn, :login))
  end

  def logout(conn, _params) do
    current_user = conn.assigns[:current_user]

    if current_user do
      conn
      |> GPlug.sign_out
      |> put_flash(:info, "Signed out")
      |> redirect(to: auth_path(conn, :login))
    else
      conn
      |> put_flash(:info, "Not logged in")
      |> redirect(to: auth_path(conn, :login))
    end
  end

  def unauthorized(conn, _params) do
    conn
    |> put_view(AuthView)
    |> render("unauthorized.html",
        layout: {LayoutView, "app.html"},
        current_user: conn.assigns[:current_user])
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_view(AuthView)
    |> render("unauthenticated.html",
        layout: {LayoutView, "app.html"},
        current_user: conn.assigns[:current_user])
  end

  defp guardian_sign_in(conn, user) do
    if user.role == "staff" || user.role == "admin" do
      GPlug.sign_in(conn, user, :access, perms: %{
        default: Permissions.max,
        admin: [:access]
      })
    else
      GPlug.sign_in(conn, user, :access, perms: %{default: Permissions.max})
    end
  end

  defp redirect_if_logged_in(conn, otherwise) do
    current_user = conn.assigns[:current_user]
    if current_user do
      redirect(conn, to: page_path(conn, :index))
    else
      otherwise.(conn)
    end
  end
end

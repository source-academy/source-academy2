defmodule SourceAcademyApi do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use SourceAcademyApi, :controller
      use SourceAcademyApi, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def controller do
    quote do
      use Phoenix.Controller, namespace: SourceAcademyApi
      import Plug.Conn
      import SourceAcademy.Gettext
    end
  end

  def view do
    quote do
      use Phoenix.View, namespace: SourceAcademyApi,
                        root: "lib/source_academy_api/templates"

      import SourceAcademyAdmin.ErrorHelpers
      import SourceAcademy.Gettext
      import SourceAcademyAdmin.ViewHelpers
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
      import SourceAcademy.Gettext
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end

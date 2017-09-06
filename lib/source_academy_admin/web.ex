defmodule SourceAcademyAdmin do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use SourceAcademyAdmin, :controller
      use SourceAcademyAdmin, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def controller do
    quote do
      use Phoenix.Controller, namespace: SourceAcademyAdmin
      import Plug.Conn
      import SourceAcademy.Router.Helpers
      import SourceAcademy.Gettext
    end
  end

  def view(parent \\ "") do
    root = Path.join([
      "lib/source_academy_admin/templates",
      parent
    ])
    quote do
      use Phoenix.View, root: unquote(root),
                        pattern: "**/*",
                        namespace: SourceAcademyAdmin
      # Import convenience functions from controllers
      import Phoenix.Controller, only: [
        get_csrf_token: 0,
        get_flash: 2,
        view_module: 1,
        current_path: 1
      ]

      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      import SourceAcademy.Router.Helpers
      import SourceAcademy.Gettext
      import SourceAcademy.ViewHelpers
      import SourceAcademyAdmin.ViewHelpers
      import SourceAcademyAdmin.ErrorHelpers
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

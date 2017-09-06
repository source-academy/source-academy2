defmodule SourceAcademy do
  @moduledoc false
  def model do
    quote do
      use Ecto.Schema
      use Timex.Ecto.Timestamps

      import Ecto.Changeset
      import Ecto.Query, only: [from: 2]
      import SourceAcademy.ModelHelper
    end
  end

  def router do
    quote do
      use Phoenix.Router
      import Plug.Conn
      import Phoenix.Controller
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end

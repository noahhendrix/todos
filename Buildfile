# ==========================================================================
# Project:   Todos
# Copyright: @2011 Noah Hendrix
# ==========================================================================

require File.expand_path('../frameworks/jasmine-sproutcore/builders/jasmine_builder', __FILE__)

# Add initial buildfile information here
config :all, :required => ["sproutcore/core_foundation", "sproutcore/datastore"], :theme => "sproutcore/empty_theme"

namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end
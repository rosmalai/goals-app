-- ~/AppData/Local/nvim/init.lua

-- 1. Load Packer
vim.cmd [[packadd packer.nvim]]

-- 2. Plugins with Packer
local packer = require('packer')
packer.startup(function(use)
  use 'wbthomason/packer.nvim'           -- Packer manages itself

  -- Dependencies FIRST
  use 'nvim-lua/plenary.nvim'            -- REQUIRED for telescope - MUST come first!
  use 'kyazdani42/nvim-web-devicons'     -- File icons

  -- UI / Themes
  use 'navarasu/onedark.nvim'            -- Colorscheme
  use 'nvim-lualine/lualine.nvim'        -- Statusline

  -- File management
  use 'nvim-tree/nvim-tree.lua'          -- File explorer
  use 'nvim-telescope/telescope.nvim'    -- Fuzzy finder
  use { 'nvim-telescope/telescope-fzf-native.nvim', run = 'make' }

  -- Syntax / LSP
  use { 'nvim-treesitter/nvim-treesitter', run = ':TSUpdate' }
  use 'neovim/nvim-lspconfig'            -- LSP support
  use 'hrsh7th/nvim-cmp'                 -- Completion
  use 'hrsh7th/cmp-nvim-lsp'             -- LSP completions
  use 'hrsh7th/cmp-buffer'               -- Buffer completions
  use 'hrsh7th/cmp-path'                 -- Path completions
  use 'L3MON4D3/LuaSnip'                 -- Snippets
  use 'saadparwaiz1/cmp_luasnip'         -- Snippet completions

  -- Git
  use 'lewis6991/gitsigns.nvim'          -- Git signs in gutter

  -- Productivity
  use 'numToStr/Comment.nvim'            -- "gc" to comment lines
  use 'windwp/nvim-autopairs'            -- Auto close brackets
end)

--------------------------------------------------------
-- Keymaps
--------------------------------------------------------
vim.g.mapleader = ' '  -- Set leader key to <Space>

-- Navigate panes with <C-h/j/k/l>
vim.keymap.set('n', '<C-h>', '<C-w>h', { desc = 'Move focus to left pane' })
vim.keymap.set('n', '<C-j>', '<C-w>j', { desc = 'Move focus to down pane' })
vim.keymap.set('n', '<C-k>', '<C-w>k', { desc = 'Move focus to up pane' })
vim.keymap.set('n', '<C-l>', '<C-w>l', { desc = 'Move focus to right pane' })

-- File explorer
vim.keymap.set('n', '<leader>e', ':NvimTreeToggle<CR>', { desc = 'Toggle file tree' })

-- Telescope shortcuts
vim.keymap.set('n', '<leader>ff', ':Telescope find_files<CR>', { desc = 'Find files' })
vim.keymap.set('n', '<leader>fg', ':Telescope live_grep<CR>', { desc = 'Search text' })
vim.keymap.set('n', '<leader>fb', ':Telescope buffers<CR>', { desc = 'Find buffers' })
vim.keymap.set('n', '<leader>fh', ':Telescope help_tags<CR>', { desc = 'Find help' })

-- Open terminal in vertical split 
vim.keymap.set('n', '<leader>t', function()
    vim.cmd('vsplit')
    vim.cmd('terminal')
end,{desc='vertical terminal'})

-- Open terminal in horizontal split 
vim.keymap.set('n','<leader>T',function()
    vim.cmd('split')
    vim.cmd('terminal')
end,{desc='Horizontal terminal'})

-- Exit terminal mode quickly
vim.keymap.set('t', '<Esc>', '<C-\\><C-n>', { noremap = true })

-- LSP keymaps
vim.keymap.set('n', 'gd', vim.lsp.buf.definition, { desc = 'Go to definition' })
vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, { desc = 'Go to declaration' })
vim.keymap.set('n', 'gr', vim.lsp.buf.references, { desc = 'Find references' })
vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, { desc = 'Go to implementation' })
vim.keymap.set('n', 'K', vim.lsp.buf.hover, { desc = 'Show hover info' })
vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, { desc = 'Rename symbol' })
vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, { desc = 'Code action' })
vim.keymap.set('n', '<leader>F', function() vim.lsp.buf.format({ async = true }) end, { desc = 'Format buffer' })

--------------------------------------------------------
-- Settings
--------------------------------------------------------
vim.opt.number = true          -- Line numbers
vim.opt.relativenumber = true  -- Relative line numbers
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.termguicolors = true   -- Better colors
vim.opt.cursorline = true      -- Highlight current line
vim.opt.splitbelow = true      -- Splits open below
vim.opt.splitright = true      -- Splits open to the right
vim.opt.scrolloff = 8          -- Keep cursor centered
vim.opt.signcolumn = 'yes'     -- Always show sign column
vim.opt.updatetime = 300       -- Faster updates
vim.opt.completeopt = 'menuone,noselect' -- Completion options

--------------------------------------------------------
-- Plugin setups
--------------------------------------------------------
-- Theme
require('onedark').setup({
  style = 'dark'
})
require('onedark').load()

-- File explorer
require('nvim-tree').setup()

-- Statusline
require('lualine').setup {
  options = { theme = 'onedark' }
}

-- Treesitter
require('nvim-treesitter.configs').setup {
  highlight = { enable = true },
  indent = { enable = true },
  ensure_installed = {
    'lua', 'vim', 'vimdoc', 'bash', 'python', 'javascript',
    'typescript', 'html', 'css', 'json', 'yaml', 'markdown'
  },
  auto_install = true
}

-- Comment
require('Comment').setup()

-- Autopairs
require('nvim-autopairs').setup()

-- Git signs
--------------------------------------------------------
-- LSP + Completion
--------------------------------------------------------
-- Setup nvim-cmp
local cmp = require('cmp')
local luasnip = require('luasnip')

cmp.setup({
  snippet = {
    expand = function(args)
      luasnip.lsp_expand(args.body)
    end,
  },
  mapping = cmp.mapping.preset.insert({
    ['<C-b>'] = cmp.mapping.scroll_docs(-4),
    ['<C-f>'] = cmp.mapping.scroll_docs(4),
    ['<C-Space>'] = cmp.mapping.complete(),
    ['<C-e>'] = cmp.mapping.abort(),
    ['<CR>'] = cmp.mapping.confirm({ select = true }),
    ['<Tab>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_next_item()
      elseif luasnip.expand_or_jumpable() then
        luasnip.expand_or_jump()
      else
        fallback()
      end
    end, { 'i', 's' }),
    ['<S-Tab>'] = cmp.mapping(function(fallback)
      if cmp.visible() then
        cmp.select_prev_item()
      elseif luasnip.jumpable(-1) then
        luasnip.jump(-1)
      else
        fallback()
      end
    end, { 'i', 's' }),
  }),
  sources = cmp.config.sources({
    { name = 'nvim_lsp' },
    { name = 'luasnip' },
    { name = 'buffer' },
    { name = 'path' },
  })
})

-- Setup LSP (Neovim 0.11+ style)
-- local lspconfig = require('lspconfig') -- Deprecated usage

-- Get capabilities
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities = require('cmp_nvim_lsp').default_capabilities(capabilities)

-- Setup language servers
vim.lsp.config.lua_ls = {
  capabilities = capabilities,
  settings = {
    Lua = {
      runtime = {
        version = 'LuaJIT',
      },
      diagnostics = {
        globals = { 'vim' },
      },
      workspace = {
        library = vim.api.nvim_get_runtime_file("", true),
      },
      telemetry = {
        enable = false,
      },
    },
  },
}
vim.lsp.enable('lua_ls')

vim.lsp.config.pyright = {
  capabilities = capabilities,
}
vim.lsp.enable('pyright')

vim.lsp.config.ts_ls = {
  capabilities = capabilities,
}
vim.lsp.enable('ts_ls')

vim.lsp.config.html = {
  capabilities = capabilities,
}
vim.lsp.enable('html')

vim.lsp.config.cssls = {
  capabilities = capabilities,
}
vim.lsp.enable('cssls')

-- Auto format on save
vim.api.nvim_create_autocmd('BufWritePre', {
  pattern = '*',
  callback = function()
    vim.lsp.buf.format({ async = false })
  end
})

-- Highlight on yank
vim.api.nvim_create_autocmd('TextYankPost', {
  pattern = '*',
  callback = function()
    vim.highlight.on_yank({ timeout = 200 })
  end
})

--------------------------------------------------------
-- Telescope setup (MUST be after plenary is loaded)
--------------------------------------------------------
local telescope_ok, telescope = pcall(require, 'telescope')
if telescope_ok then
  local actions_ok, actions = pcall(require, 'telescope.actions')
  if not actions_ok then
      print("Telescope actions not available. Run :PackerSync")
      return
  end

  telescope.setup({
    defaults = {
      mappings = {
        i = {
          ['<C-j>'] = actions.move_selection_next,
          ['<C-k>'] = actions.move_selection_previous,
        }
      }
    }
  })
  
  -- Load fzf extension if available
  pcall(telescope.load_extension, 'fzf')
else
  print("Telescope not available. Run :PackerSync to install plugins.")
end


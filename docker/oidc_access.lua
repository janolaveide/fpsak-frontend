
local callback_host = "https://" .. ngx.var.host
-- local backup_content_type = ngx.header.content_type;
if ngx.var.host == "localhost" then
    callback_host = "http://localhost:" .. ngx.var.server_port
    local openidc = require("resty.openidc")
    openidc.set_logging(nil, { DEBUG = ngx.INFO } )
end

local opts = {
    redirect_uri = callback_host .. ngx.var.app_callback_path,
    client_id = ngx.var.oidc_agentname,
    client_secret = ngx.var.oidc_password,
    scope = "openid",
    ssl_verify = "no",
    token_endpoint_auth_method = "client_secret_basic",
    discovery = ngx.var.oidc_host_url .. "/oauth2/.well-known/openid-configuration",
    access_token_expires_leeway = 240,
    renew_access_token_on_expiry = true,
    session_contents = {
        id_token = true,
        access_token = true,
        enc_id_token = true
    }
}

-- starting session manual to set some default cookies.
local session = require("resty.session").start()

if ngx.var.cookie_ADRUM and ngx.var.cookie_ADRUM ~= session.data.ADRUM then
    session.data.ADRUM = ngx.var.cookie_ADRUM
end

if not ngx.req.get_headers()["Authorization"] then
    local res, err = require("resty.openidc").authenticate(opts, nil, nil, session)
    -- authenticate might change content_type...
    -- ngx.header.content_type = backup_content_type
    if err then
        ngx.status = 500
        ngx.header.content_type = 'text/plain';
        ngx.say(err)
        ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    end

    if ngx.var.uri == ngx.var.app_callback_path or ngx.var.uri == ngx.var.app_login_path then
        return ngx.redirect(ngx.var.app_path_prefix)
    end

    local proxy_cookie = {}
    -- adding ADRUM cookie if existant
    if session.data.ADRUM then
        proxy_cookie.ADRUM = session.data.ADRUM
    end

    if ngx.var.cookie_ADRUM then
        proxy_cookie.ADRUM = ngx.var.cookie_ADRUM
    end

    -- adding ID_token if logged in
    if session.data.enc_id_token then
        proxy_cookie.ID_token = session.data.enc_id_token
    end

    -- pass ADRUM(EUM) cookie if present
    local proxy_cookie_string = ""
    for k, v in pairs(proxy_cookie) do
        proxy_cookie_string = proxy_cookie_string .. k .. "=" .. v .. ";"
    end
    ngx.var.proxy_cookie = proxy_cookie_string
end
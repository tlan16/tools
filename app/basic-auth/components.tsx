'use client';

import {
  BasicAuthCredentials,
  CredentialOptions,
  defaultCredential,
  defaultPasswordOptions,
  generateCredentials,
  generatePassword,
  generateUsername
} from "@/app/basic-auth/generateCredentials";
import {useForm} from "react-hook-form";
import {useClipboard} from "@/hooks/use-clipboard";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Codeblock} from "@/components/codeblock/codeblock";

type FormInputs = {
  username: string
  password: string
  credentialOptions: CredentialOptions
  credentials: BasicAuthCredentials
}

export function BasicAuth() {
  const {
    register,
    formState: {dirtyFields},
    getValues,
    setValue,
    resetField,
  } = useForm<FormInputs>({
    defaultValues: ({
      username: defaultCredential.username,
      password: defaultCredential.password,
      credentialOptions: defaultPasswordOptions,
      credentials: defaultCredential,
    } satisfies FormInputs),
  });

  const {copyToClipboard} = useClipboard()
  const updateCredentials = () => {
    let new_username = getValues("username")?.trim() ?? ""
    let new_password = getValues("password")?.trim() ?? ""
    let dirty = dirtyFields.username && dirtyFields.password

    if (!new_username || !dirty) {
      new_username = generateUsername(getValues("credentialOptions.usernameLength"))
    }
    if (!new_password || !dirty) {
      new_password = generatePassword(getValues("credentialOptions"))
    }
    const new_credentials = generateCredentials(new_username, new_password)
    setValue('credentials', new_credentials)
    resetField("username", {defaultValue: new_credentials.username})
    resetField("password", {defaultValue: new_credentials.password})
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 xl:p-12 pt-4 sm:pt-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Basic Auth</h2>
      </div>

      <div className="space-y-6 w-full">
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">Generate Basic Auth Credentials</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Generate username and password for HTTP Basic Authentication with htpasswd file output.
          </p>

          {/* Generation Options */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium">Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username Length</label>
                <Input
                  type="number"
                  min="4"
                  max="32"
                  {...register("credentialOptions.usernameLength", {
                    onChange: updateCredentials
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Length</label>
                <Input
                  type="number"
                  min="8"
                  max="64"
                  {...register("credentialOptions.passwordLength", {
                    onChange: updateCredentials
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Include in Password</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    {...register("credentialOptions.includeNumbers", {
                      onChange: updateCredentials
                    })}
                  />
                  <span className="text-sm">Numbers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    {...register("credentialOptions.includeUppercase", {
                      onChange: updateCredentials
                    })}
                  />
                  <span className="text-sm">Uppercase Letters</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    {...register("credentialOptions.includeSpecialChars", {
                      onChange: updateCredentials
                    })}
                  />
                  <span className="text-sm">Special Characters</span>
                </label>
              </div>
            </div>
          </div>

          <Button
            onClick={updateCredentials}
            variant="elevated"
            size="default"
            className="px-3 md:px-6"
          >
            Generate
          </Button>
        </div>

        {/* Editable Credentials */}
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Enter username"
                {...register("username", {
                  onChange: () => {
                    if (getValues('username')?.trim())
                      updateCredentials()
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                placeholder="Enter password"
                {...register("password", {
                  onChange: () => {
                    if (getValues('password')?.trim())
                      updateCredentials()
                  }
                })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full">
          {/* Auth Header */}
          <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">HTTP Authorization Header</h3>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                onClick={() => copyToClipboard(getValues('credentials.authHeader'))}
              >
                Copy
              </Button>
            </div>
            <Codeblock language="http" theme="github-light" showLanguage={false}>
              {getValues('credentials.authHeader')}
            </Codeblock>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:hidden"
              onClick={() => copyToClipboard(getValues('credentials.authHeader'))}
            >
              Copy header
            </Button>
          </div>

          {/* .htpasswd Content */}
          <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">.htpasswd File Content</h3>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                onClick={() => copyToClipboard(getValues('credentials.htpasswdContent'))}
              >
                Copy
              </Button>
            </div>
            <Codeblock language="http" theme="github-light" showLanguage={false}>
              {getValues('credentials.htpasswdContent')}
            </Codeblock>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:hidden"
              onClick={() => copyToClipboard(getValues('credentials.htpasswdContent'))}
            >
              Copy .htpasswd content
            </Button>
          </div>

          {/* Example URL */}
          <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">Example URL with Embedded Auth</h3>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                onClick={() => copyToClipboard(getValues('credentials.exampleUrl'))}
              >
                Copy
              </Button>
            </div>
            <Codeblock language="url" theme="github-light" showLanguage={false}>
              {getValues('credentials.exampleUrl')}
            </Codeblock>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:hidden"
              onClick={() => copyToClipboard(getValues('credentials.exampleUrl'))}
            >
              Copy URL
            </Button>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Usage Instructions</h3>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <strong className="text-primary">1. HTTP Authorization Header:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Use the generated header in your HTTP requests to authenticate with Basic Auth protected resources.
              </p>
            </div>
            <div>
              <strong className="text-primary">2. .htpasswd File Setup:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Create a .htpasswd file in a secure location (outside your web root) and paste the generated content.
                Then reference this file in your nginx server configuration.
              </p>
            </div>
            <div>
              <strong className="text-primary">3. Nginx Configuration Example:</strong>
              <Codeblock language="nginx" theme="github-light" showLanguage={false}>
                {
                  `location /protected/ {\n` +
                  [
                    `auth_basic "Restricted Area";`,
                    `auth_basic_user_file /path/to/.htpasswd;`,
                    `try_files $uri $uri/ =404;`
                  ].map(
                    line => `\t${line}`
                  ).join("\n") + "\n"
                  + `}`
                }
              </Codeblock>
            </div>
            <div>
              <strong className="text-primary">4. URL with Embedded Auth:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Use the example URL format for quick testing, but avoid embedding credentials in URLs in production
                environments.
              </p>
            </div>
            <div>
              <strong className="text-primary">5. Security Notes:</strong>
              <ul className="ml-4 mt-2 list-disc text-muted-foreground space-y-1">
                <li>Always use HTTPS when transmitting Basic Auth credentials</li>
                <li>Store the .htpasswd file outside your web root directory</li>
                <li>The generated hash is simplified for demo - use proper bcrypt in production</li>
                <li>Consider using more secure authentication methods for production applications</li>
                <li>Regularly rotate credentials and use strong, unique passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

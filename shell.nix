{ pkgs ? import <nixpkgs> { }
}:

with pkgs;
let
	inherit (lib) optional optionals;
in
mkShell {
	buildInputs = [
		(import ./nix/default.nix { inherit pkgs; })
		niv
	] ++ optional stdenv.isLinux inotify-tools;
	shellHook = ''
		export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
	'';
}

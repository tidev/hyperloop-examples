/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_PARSER_H
#define HYPERLOOP_PARSER_H

#include <string>
#include <map>
#include <set>
#include "clang-c/Index.h"
#include "def.h"

namespace hyperloop {

	class ClassDefinition;
	class TypeDefinition;
	class EnumDefinition;
	class VarDefinition;
	class FunctionDefinition;
	class StructDefinition;
	class UnionDefinition;
	class ParserContext;

	typedef std::map<std::string, ClassDefinition *> ClassMap;
	typedef std::map<std::string, TypeDefinition *> TypeMap;
	typedef std::map<std::string, EnumDefinition *> EnumMap;
	typedef std::map<std::string, VarDefinition *> VarMap;
	typedef std::map<std::string, FunctionDefinition *> FunctionMap;
	typedef std::map<std::string, StructDefinition *> StructMap;
	typedef std::map<std::string, UnionDefinition *> UnionMap;
	typedef std::map<std::string, std::set<std::string>> Blocks;

	/**
	 * state of the parser tree
	 */
	class ParserTree : public Serializable {
		public:
			ParserTree ();
			virtual ~ParserTree();

			void addClass (ClassDefinition *definition);
			void addProtocol (ClassDefinition *definition);
			void addType (TypeDefinition *definition);
			void addEnum (EnumDefinition *definition);
			void addVar (VarDefinition *definition);
			void addFunction (FunctionDefinition *definition);
			void addStruct (StructDefinition *definition);
			void addUnion (UnionDefinition *definition);
			void addBlock (const std::string &framework, const std::string &def);

			ClassDefinition* getClass (const std::string &name);
			TypeDefinition* getType (const std::string &name);
			StructDefinition* getStruct (const std::string &name);
			UnionDefinition* getUnion (const std::string &name);
			EnumDefinition* getEnum (const std::string &name);

			bool hasClass (const std::string &name);
			bool hasType (const std::string &name);
			bool hasStruct (const std::string &name);
			bool hasUnion (const std::string &name);
			bool hasEnum (const std::string &name);

			void setContext (ParserContext *);
			virtual Json::Value toJSON() const;

		private:
			ParserContext *context;
			ClassMap classes;
			ClassMap protocols;
			TypeMap types;
			EnumMap enums;
			VarMap vars;
			FunctionMap functions;
			StructMap structs;
			UnionMap unions;
	};

	/**
	 * information about the parse context
	 */
	class ParserContext {
		public:
			ParserContext (const std::string &_sdkPath, const std::string &_minVersion, bool exclude);
			~ParserContext();
			void updateLocation (const std::map<std::string, std::string> &location);
			inline const std::string& getSDKPath() const { return sdkPath; }
			inline const std::string& getMinVersion() const { return minVersion; }
			inline const bool excludeSystemAPIs() const { return excludeSys; }
			inline const std::string& getCurrentFilename () const { return filename; }
			inline const std::string& getCurrentLine () const { return line; }
			inline ParserTree* getParserTree() { return &tree; }
			void setCurrent (Definition *current);
			inline Definition* getCurrent() { return current; }
			inline Definition* getPrevious() { return previous; }
		private:
			std::string sdkPath;
			std::string minVersion;
			bool excludeSys;
			std::string filename;
			std::string line;
			ParserTree tree;
			Definition* previous;
			Definition* current;
	};

	/**
	 * parse the translation unit and return a ParserContext
	 */
	ParserContext* parse (CXTranslationUnit tu, std::string &sdkPath,  std::string &minVersion, bool excludeSystemAPIs);
}


#endif
